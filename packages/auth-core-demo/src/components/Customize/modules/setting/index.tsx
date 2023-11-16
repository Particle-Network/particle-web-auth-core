import { toHexString } from '@/utils/index';
import { ChromePicker } from '@nbfe/react-color';
import { useCustomize } from '@particle-network/auth-core-modal';
import {
    Button,
    Col,
    Collapse,
    Form,
    Input,
    InputNumber,
    Popover,
    Radio,
    Row,
    Slider,
    Typography,
    message,
} from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import cloneDeep from 'lodash/cloneDeep.js';
import { useEffect, useState } from 'react';
import {
    ItemType,
    defaultLogo,
    formDataToConfig,
    getFormData,
    getThemeConfigFormData,
    themeConfig,
    updateFormData,
} from './config';
import styles from './index.module.scss';

const { Text } = Typography;
const { Panel } = Collapse;

export const PopoverProps: any = {
    placement: 'bottomRight',
    trigger: 'click',
    overlayClassName: 'popover-chrome-picker',
    getPopupContainer: () => {
        return document.querySelector('.configuration-container');
    },
};

interface Props {
    iframeContentRef: any;
}

const Setting = (props: Props) => {
    const [form] = Form.useForm();

    const { customStyle, setCustomStyle } = useCustomize();

    const [themeMode, setThemeMode] = useState('lightMode');

    const [formData, setFormData] = useState(getFormData(cloneDeep(themeConfig)));

    const changeHandler = debounce((key?: string[], value?: string | number) => {
        if (key && value) {
            form.setFieldValue(key, value);
            setFormData(updateFormData(cloneDeep(formData), key, value));

            if (themeConfig?.[key[1]]?.universal) {
                const newKey = [themeMode === 'lightMode' ? 'darkMode' : 'lightMode', key[1]];
                form.setFieldValue(newKey, value);
                setFormData(updateFormData(cloneDeep(formData), newKey, value));
            }
        }
        const newFormData = form.getFieldsValue();

        props.iframeContentRef.current?.querySelectorAll('iframe').forEach((iframe: any) => {
            updateThemeHandler(
                iframe,
                {
                    ...(themeMode === 'lightMode' ? newFormData.lightMode : newFormData.darkMode),
                },
                themeMode
            );
        });
    }, 12);

    const updateThemeHandler = (iframe: any, theme: any, themeMode: string) => {
        const themeStr = Object.keys(theme)
            .map((key) => {
                const name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                let value = theme[key];
                if (!isNaN(Number(value))) {
                    value = value + 'px';
                }
                return `--${name}:${value};`;
            })
            .join('');

        const width = theme.modalWidth < 300 ? 300 : theme.modalWidth > 800 ? 800 : theme.modalWidth;
        const height = theme.modalHeight < 610 ? 610 : theme.modalHeight > 900 ? 900 : theme.modalHeight;

        iframe.width = width + 'px';
        iframe.height = height + 'px';
        const templatesContainerEl = document.querySelector('.templates-container') as HTMLDivElement;
        if (templatesContainerEl) {
            templatesContainerEl.style.gridTemplateColumns = `repeat(auto-fill, ${width}px)`;
        }

        const rootEL = iframe.contentWindow.document.querySelector('.particle-auth-core-shadow-root') as HTMLDivElement;
        if (rootEL) {
            rootEL.classList.remove('light', 'dark');
            rootEL.classList.add(themeMode === 'lightMode' ? 'light' : 'dark');

            // update style
            const particleCustomThemeClassName = 'particle-custom-theme';
            let particleCustomThemeStyle = rootEL.querySelector(`.${particleCustomThemeClassName}`);
            if (!particleCustomThemeStyle) {
                particleCustomThemeStyle = document.createElement('style');
                particleCustomThemeStyle.classList.add(particleCustomThemeClassName);
                rootEL.appendChild(particleCustomThemeStyle);
            }

            if (themeMode === 'lightMode') {
                particleCustomThemeStyle.innerHTML = `.particle-auth-core-shadow-root{${themeStr}}*{color-scheme: ${
                    themeMode === 'lightMode' ? 'light' : 'dark'
                };}`;
            } else {
                particleCustomThemeStyle.innerHTML = `.particle-auth-core-shadow-root.dark{${themeStr}}*{color-scheme: ${
                    themeMode === 'lightMode' ? 'light' : 'dark'
                };}`;
            }

            // upstate script
            const particleCustomThemeScriptClassName = 'particle-custom-theme-script';
            let particleCustomThemeScript = rootEL.querySelector(`.${particleCustomThemeScriptClassName}`);
            if (particleCustomThemeScript) {
                particleCustomThemeScript.remove();
            }
            particleCustomThemeScript = document.createElement('script');
            particleCustomThemeScript.classList.add(particleCustomThemeScriptClassName);
            rootEL.appendChild(particleCustomThemeScript);

            particleCustomThemeScript.innerHTML = `
                window.themeConfig = ${JSON.stringify(theme)};
                var projectNameEl=document.body.querySelector('.login-header0');
                if(projectNameEl){
                    projectNameEl.innerHTML=(window.themeConfig['projectName']||'Particle Auth').substr(0,40);
                }
                var loginDesEl = document.body.querySelector('.login-des');
                if(loginDesEl){
                    loginDesEl.innerHTML=(window.themeConfig['subtitle']||'Login to App to continue').substr(0,60);
                }
                var loginLogoEl = document.body.querySelector('.login-logo');
                if(loginLogoEl){
                    loginLogoEl.querySelector('img').src=window.themeConfig['logo']||'${defaultLogo}';
                }
            `;
        }
    };

    useEffect(() => {
        const iframes = props.iframeContentRef.current?.querySelectorAll('iframe');
        const newFormData = form.getFieldsValue();
        [...iframes].map((iframe: HTMLIFrameElement) => {
            const onload = () => {
                updateThemeHandler(
                    iframe,
                    {
                        ...(themeMode === 'lightMode' ? newFormData.lightMode : newFormData.darkMode),
                    },
                    themeMode
                );
            };
            iframe.onload = onload;
            onload();
        });
    }, [themeMode]);

    useEffect(() => {
        const customModalOptions = JSON.parse(localStorage.getItem('customModalOptions') || '{}');
        localStorage.setItem(
            'customModalOptions',
            JSON.stringify({
                ...customModalOptions,
                customStyle,
            })
        );
    }, [customStyle]);

    return (
        <div className={styles.container}>
            <div className="configuration-container">
                <Form form={form} layout={'vertical'} autoComplete="off">
                    <div className={classNames('select-theme')}>
                        <div className="theme-title">Theme</div>
                        <div className="theme-des">Preset Style</div>
                        <div className="theme-selection">
                            <Radio.Group
                                optionType="button"
                                value={themeMode}
                                onChange={(e) => setThemeMode(e.target.value)}
                            >
                                <Radio value="lightMode">Light Mode</Radio>
                                <Radio value="darkMode">Dark Mode</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="scroll-content">
                        {[formData.lightGroups, formData.darkGroups].map((themeGroup, themeIndex) => {
                            return (
                                <Collapse
                                    bordered={false}
                                    key={themeIndex}
                                    className={`theme-group ${themeIndex == 0 ? 'theme-light' : 'theme-dark'}`}
                                    style={{
                                        display:
                                            (themeMode === 'lightMode' && themeIndex === 0) ||
                                            (themeMode === 'darkMode' && themeIndex === 1)
                                                ? 'block'
                                                : 'none',
                                    }}
                                >
                                    {themeGroup.map((item, index) => {
                                        return (
                                            <Panel
                                                key={`${item.groupType}-${themeIndex}-${index}`}
                                                forceRender={true}
                                                header={
                                                    <>
                                                        <img src={item.icon.src} alt="" />
                                                        <Text strong>{item.label}</Text>
                                                    </>
                                                }
                                            >
                                                {item.groups.map((data, dataIndex) => {
                                                    return (
                                                        <Form.Item
                                                            noStyle={true}
                                                            key={`${item.groupType}-${themeIndex}-${index}-${dataIndex}`}
                                                        >
                                                            <div className="item-label">{data.label}</div>
                                                            {data.type === ItemType.Color && (
                                                                <Form.Item name={data.key} initialValue={data.value}>
                                                                    <Input
                                                                        data-aaaaaaaa={data.value}
                                                                        onChange={() => {
                                                                            const value = form.getFieldValue(data.key);
                                                                            changeHandler(data.key, value);
                                                                        }}
                                                                        suffix={
                                                                            data.type === ItemType.Color ? (
                                                                                <Popover
                                                                                    {...PopoverProps}
                                                                                    content={
                                                                                        <ChromePicker
                                                                                            color={data.value}
                                                                                            onChange={(e: any) => {
                                                                                                const value =
                                                                                                    toHexString(e.rgb);
                                                                                                changeHandler(
                                                                                                    data.key,
                                                                                                    value
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        className="color-trigger"
                                                                                        data-bbbbbbbbb={data.value}
                                                                                        style={{
                                                                                            background: data.value,
                                                                                        }}
                                                                                    />
                                                                                </Popover>
                                                                            ) : (
                                                                                <></>
                                                                            )
                                                                        }
                                                                    />
                                                                </Form.Item>
                                                            )}
                                                            {data.type === ItemType.Radius && (
                                                                <Row className="slider-row">
                                                                    <Col span={16} className="slider-wrap">
                                                                        <Slider
                                                                            max={30}
                                                                            value={
                                                                                parseInt(
                                                                                    form.getFieldValue(data.key)
                                                                                ) || 0
                                                                            }
                                                                            onChange={(value) => {
                                                                                changeHandler(data.key, value + 'px');
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col span={8}>
                                                                        <Form.Item
                                                                            name={data.key}
                                                                            initialValue={data.value}
                                                                        >
                                                                            <Input
                                                                                onChange={(e) => {
                                                                                    const value = form.getFieldValue(
                                                                                        data.key
                                                                                    );
                                                                                    changeHandler(data.key, value);
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                            {data.type === ItemType.Input && (
                                                                <Form.Item name={data.key} initialValue={data.value}>
                                                                    <Input
                                                                        onChange={(e) => {
                                                                            const value = form.getFieldValue(data.key);
                                                                            changeHandler(data.key, value);
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            )}

                                                            {data.type === ItemType.Number && (
                                                                <Form.Item name={data.key} initialValue={data.value}>
                                                                    <InputNumber
                                                                        className={'m-input-' + data.key[1]}
                                                                        type="number"
                                                                        min={data.key[1] === 'modalWidth' ? 330 : 606}
                                                                        max={data.key[1] === 'modalWidth' ? 700 : 1000}
                                                                        onChange={(e) => {
                                                                            const value = form.getFieldValue(data.key);
                                                                            changeHandler(
                                                                                data.key,
                                                                                Number(value as any) || 0
                                                                            );
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            )}
                                                        </Form.Item>
                                                    );
                                                })}
                                            </Panel>
                                        );
                                    })}
                                </Collapse>
                            );
                        })}
                    </div>
                    <div className="footer btns">
                        <Row>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        const formData = form.getFieldsValue();
                                        const customStyle = formDataToConfig(formData);
                                        setCustomStyle(customStyle);
                                        message.success('Settinngs saved successfully!');
                                        setTimeout(() => {
                                            location.href = '/';
                                        }, 300);
                                    }}
                                >
                                    Apply
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="default"
                                    onClick={() => {
                                        const formData = getThemeConfigFormData();
                                        Object.keys(formData.darkMode).forEach((key) => {
                                            form.setFieldValue(['darkMode', key], formData.darkMode[key]);
                                        });

                                        Object.keys(formData.lightMode).forEach((key) => {
                                            form.setFieldValue(['lightMode', key], formData.lightMode[key]);
                                        });

                                        changeHandler();
                                    }}
                                >
                                    Reset
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div
                                    className="load-theme"
                                    onClick={() => {
                                        if (
                                            props.iframeContentRef.current
                                                .querySelector('.templates-container')
                                                .getAttribute('data-loading') === 'true'
                                        ) {
                                            message.error(
                                                'Please wait for the iframe to load before loading the theme'
                                            );
                                            return false;
                                        }

                                        let currentCustomStyle = customStyle as any;
                                        // 加载当前主题
                                        if (!currentCustomStyle.logo) {
                                            currentCustomStyle = getThemeConfigFormData();
                                        }

                                        const formData = form.getFieldsValue();

                                        let newFormData = getFormData(cloneDeep(themeConfig));

                                        Object.keys(formData.darkMode).forEach((key) => {
                                            const value =
                                                currentCustomStyle?.[key] ||
                                                currentCustomStyle?.theme?.dark?.[key] ||
                                                currentCustomStyle?.['darkMode']?.[key];
                                            form.setFieldValue(['darkMode', key], value);
                                            newFormData = updateFormData(newFormData, ['darkMode', key], value);
                                        });
                                        Object.keys(formData.lightMode).forEach((key) => {
                                            const value =
                                                currentCustomStyle?.[key] || currentCustomStyle?.theme?.light?.[key];
                                            form.setFieldValue(
                                                ['lightMode', key],
                                                currentCustomStyle?.[key] ||
                                                    currentCustomStyle?.theme?.light?.[key] ||
                                                    currentCustomStyle?.['lightMode']?.[key]
                                            );
                                            newFormData = updateFormData(newFormData, ['lightMode', key], value);
                                        });

                                        setFormData(newFormData);

                                        setTimeout(() => {
                                            changeHandler();
                                        });
                                    }}
                                >
                                    Load Current Theme
                                </div>
                            </Col>

                            <Col>
                                <div
                                    className="copy-theme"
                                    onClick={() => {
                                        const formData = form.getFieldsValue();
                                        const customStyle = formDataToConfig(formData);
                                        const themeConfig = {
                                            ...customStyle,
                                            theme: {
                                                light: formData.lightMode,
                                                dark: formData.darkMode,
                                            },
                                        };

                                        delete themeConfig.theme.light.logo;
                                        delete themeConfig.theme.dark.logo;
                                        delete themeConfig.theme.light.projectName;
                                        delete themeConfig.theme.dark.projectName;
                                        delete themeConfig.theme.light.subtitle;
                                        delete themeConfig.theme.dark.subtitle;
                                        delete themeConfig.theme.light.modalWidth;
                                        delete themeConfig.theme.dark.modalWidth;
                                        delete themeConfig.theme.light.modalHeight;
                                        delete themeConfig.theme.dark.modalHeight;
                                        delete themeConfig.theme.light.primaryBtnBorderRadius;
                                        delete themeConfig.theme.dark.primaryBtnBorderRadius;
                                        delete themeConfig.theme.light.modalBorderRadius;
                                        delete themeConfig.theme.dark.modalBorderRadius;
                                        delete themeConfig.theme.light.cardBorderRadius;
                                        delete themeConfig.theme.dark.cardBorderRadius;

                                        const themeConfigStr = JSON.stringify(themeConfig, null, 4);
                                        navigator.clipboard.writeText(themeConfigStr);
                                        message.success('Copy theme json successfully!');
                                    }}
                                >
                                    Copy theme json
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Setting;
