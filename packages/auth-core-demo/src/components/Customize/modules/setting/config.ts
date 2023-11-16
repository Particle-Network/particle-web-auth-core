import bordersIcon from '../../../../assets/images/icons/Borders.svg';
import colorsIcon from '../../../../assets/images/icons/Colors.svg';
import TextsIcon from '../../../../assets/images/icons/Texts.svg';

export enum ItemType {
    Color = 'color',
    Radius = 'radius',
    Input = 'input',
    Number = 'number',
}
export enum GroupType {
    Colors = 'colors',
    Borders = 'borders',
    Logo = 'logo',
    Texts = 'Texts',
}

export const defaultLogo = 'https://wallet.particle.network/favicon.ico';

export const themeConfig: any = {
    logo: {
        type: ItemType.Input,
        group: GroupType.Texts,
        universal: true,
        value: defaultLogo,
    },
    projectName: {
        type: ItemType.Input,
        group: GroupType.Texts,
        universal: true,
        value: 'Particle Auth',
    },
    subtitle: {
        type: ItemType.Input,
        group: GroupType.Texts,
        universal: true,
        value: 'Login to App to continue',
    },
    modalWidth: {
        type: ItemType.Number,
        group: GroupType.Texts,
        universal: true,
        value: 400,
    },
    modalHeight: {
        type: ItemType.Number,
        group: GroupType.Texts,
        universal: true,
        value: 650,
    },
    primaryBtnBorderRadius: {
        type: ItemType.Radius,
        group: GroupType.Borders,
        universal: true,
        value: 18,
    },
    modalBorderRadius: {
        type: ItemType.Radius,
        group: GroupType.Borders,
        universal: true,
        value: 18,
    },
    cardBorderRadius: {
        type: ItemType.Radius,
        group: GroupType.Borders,
        universal: true,
        value: 18,
    },
    lightMode: {
        primaryBtnColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#fff',
        },
        primaryBtnBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#000',
        },
        secondaryBtnColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#000',
        },
        secondaryBtnBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#f2f2f2',
        },
        textColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#000',
        },
        secondaryTextColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#86899d',
        },
        themeBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#fff',
        },
        iconBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#cdd6e1',
        },
        accentColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#a257fa',
        },
        inputBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#f5f4f6',
        },
        inputBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#f5f3f5',
        },
        inputPlaceholderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#86899d',
        },
        // cardHoverBorderColor: {
        //     type: ItemType.Color,
        //     group: GroupType.Colors,
        //     universal: false,
        //     value: '#86899d',
        // },
        cardBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#dcdfe6',
        },
        cardUnclickableBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#f7f8f9',
        },
        cardUnclickableBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#eef2f9',
        },
        cardDividerColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#e5e5e5',
        },
        tagBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#f2f3f6',
        },
        modalBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#fff',
        },
        tipsBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#eab98133',
        },
    },
    darkMode: {
        primaryBtnColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#000',
        },
        primaryBtnBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#fff',
        },
        secondaryBtnColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#fff',
        },
        secondaryBtnBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#474747',
        },
        textColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#fff',
        },
        secondaryTextColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#999999',
        },
        themeBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#1c1d22',
        },
        iconBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#252525',
        },
        accentColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#5177f9',
        },
        inputBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#2b2b2c',
        },
        inputBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#252525',
        },
        inputPlaceholderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#999999',
        },
        // cardHoverBorderColor: {
        //     type: ItemType.Color,
        //     group: GroupType.Colors,
        //     universal: false,
        //     value: '#35383a',
        // },
        cardBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#313334',
        },
        cardUnclickableBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#181818',
        },
        cardUnclickableBorderColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#252525',
        },
        cardDividerColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#252525',
        },
        tagBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#202327',
        },
        modalBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#212324',
        },
        tipsBackgroundColor: {
            type: ItemType.Color,
            group: GroupType.Colors,
            universal: false,
            value: '#eab98159',
        },
    },
};

export const formDataToConfig = (formData: any) => {
    const customStyle: any = {
        theme: { light: {}, dark: {} },
    };
    Object.keys(themeConfig)
        .filter((key) => key !== 'darkMode' && key !== 'lightMode' && key)
        .forEach((key) => {
            customStyle[key] = formData['lightMode'][key] || '';
        });

    Object.keys(themeConfig.lightMode).forEach((key) => {
        customStyle.theme.light[key] = formData['lightMode'][key] || '';
    });
    Object.keys(themeConfig.darkMode).forEach((key) => {
        customStyle.theme.dark[key] = formData['darkMode'][key] || '';
    });
    return customStyle;
};
export const getThemeConfigFormData = () => {
    const universalProps = Object.fromEntries(
        Object.keys(themeConfig)
            .filter((key) => key !== 'darkMode' && key !== 'lightMode' && key)
            .map((key) => {
                return [key, themeConfig[key].value];
            })
    );
    const lightProps = Object.fromEntries(
        Object.keys(themeConfig.lightMode).map((key) => {
            return [key, themeConfig.lightMode[key].value];
        })
    );
    const darkProps = Object.fromEntries(
        Object.keys(themeConfig.darkMode).map((key) => {
            return [key, themeConfig.darkMode[key].value];
        })
    );
    return {
        lightMode: {
            ...universalProps,
            ...lightProps,
        },
        darkMode: {
            ...universalProps,
            ...darkProps,
        },
    };
};

const formatItemLabel = (label: string) => {
    const words = label.split(/(?=[A-Z])/).map((word) => {
        if (word === 'Btn') {
            return 'Button';
        }
        return word;
    });

    let formattedLabel = words.join(' ');
    formattedLabel = formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1).toLowerCase();

    return formattedLabel;
};

export const getFormData = (themeConfig: any) => {
    const lightGroups = [
        {
            label: 'Colors',
            icon: colorsIcon,
            groupType: GroupType.Colors,
        },
        {
            label: 'Borders',
            icon: bordersIcon,
            groupType: GroupType.Borders,
        },
        // {
        //     label: 'Logo',
        //     groupType: GroupType.Logo,
        // },
        {
            label: 'Texts',
            icon: TextsIcon,
            groupType: GroupType.Texts,
        },
    ].map((item) => {
        const { groupType } = item;

        const groups = [
            ...Object.keys(themeConfig)
                .filter((o) => themeConfig[o].group === groupType)
                .map((key) => {
                    return {
                        ...themeConfig[key],
                        label: formatItemLabel(key),
                        key: ['lightMode', key],
                    };
                }),

            ...Object.keys(themeConfig.lightMode)
                .filter((o) => themeConfig.lightMode[o].group === groupType)
                .map((key) => {
                    return {
                        ...item,
                        ...themeConfig.lightMode[key],
                        label: formatItemLabel(key),
                        key: ['lightMode', key],
                    };
                }),
        ];

        if (groupType === GroupType.Colors) {
            const index = groups.findIndex((o) => o.key.join('.') === 'lightMode.themeBackgroundColor');
            groups.unshift(groups.splice(index, 1)[0]);
        }

        return {
            ...item,
            groups,
        };
    });

    const darkGroups = [
        {
            label: 'Colors',
            icon: colorsIcon,
            groupType: GroupType.Colors,
        },
        {
            label: 'Borders',
            icon: bordersIcon,
            groupType: GroupType.Borders,
        },
        // {
        //     label: 'Logo',
        //     groupType: GroupType.Logo,
        // },
        {
            label: 'Texts',
            icon: TextsIcon,
            groupType: GroupType.Texts,
        },
    ].map((item) => {
        const { groupType } = item;

        const groups = [
            ...Object.keys(themeConfig)
                .filter((o) => themeConfig[o].group === groupType)
                .map((key) => {
                    return {
                        ...themeConfig[key],
                        label: formatItemLabel(key),
                        key: ['darkMode', key],
                    };
                }),

            ...Object.keys(themeConfig.darkMode)
                .filter((o) => themeConfig.darkMode[o].group === groupType)
                .map((key) => {
                    return {
                        ...item,
                        ...themeConfig.darkMode[key],
                        label: formatItemLabel(key),
                        key: ['darkMode', key],
                    };
                }),
        ];
        if (groupType === GroupType.Colors) {
            const index = groups.findIndex((o) => o.key.join('.') === 'darkMode.themeBackgroundColor');
            groups.unshift(groups.splice(index, 1)[0]);
        }
        return {
            ...item,
            groups,
        };
    });
    return { lightGroups, darkGroups };
};

export const updateFormData = (formData: any, key: string[], value: string | number) => {
    formData[key[0] === 'lightMode' ? 'lightGroups' : 'darkGroups'].forEach((item: any) => {
        item.groups.forEach((group: any) => {
            if (group.key.join('.') === key.join('.')) {
                group.value = value;
            }
        });
    });
    return JSON.parse(JSON.stringify(formData));
};
