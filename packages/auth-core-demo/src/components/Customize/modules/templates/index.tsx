import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

const styleContent = `
<style>
        html:not([data-hash="#/login"]) .particle-auth-core-shadow-root,
        html:not([data-hash="#/login"]) body {
            background: none !important;
        }

        .root-particle-modal-container>.ant-modal {
            max-width: 100% !important;
            position : absolute !important;
            top      : 0 !important;
            left     : 0 !important;
            width    : 100% !important;
            height   : 100% !important;
            padding  : 0 !important;
            margin   : 0 !important;
        }

        .root-particle-modal-container>.ant-modal>.ant-modal-content {
            box-shadow: none !important;
            border    : 1px solid #ddd !important;
        }

        .root-particle-modal-container>.ant-modal>.ant-modal-content>.ant-modal-body {
       
        }

        .root-particle-modal-container>.ant-modal>.ant-modal-content>.ant-modal-body>.ant-modal-root {
      
        }

        body > div > div > div.ant-modal-root > div.ant-modal-mask{
            display:none !important;
        }

</style>
`;

export enum TemplateType {
    accountSecurity = 'accountSecurity',
    authorization = 'authorization',
    gasFee = 'gasFee',
    linkAccounts = 'linkAccounts',
    login = 'login',
    transactionPaymentPassword = 'transactionPaymentPassword',
    phoneLogin = 'phoneLogin',
    sendTransaction = 'sendTransaction',
    setMasterPassword = 'setMasterPassword',
    setpaymentPassword = 'setpaymentPassword',
    signMessage = 'signMessage',
    verification = 'verification',
    verificationDetails = 'verificationDetails',
    confirmationModal = 'confirmationModal',
}

const Template = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [templates, setTemplates] = useState<any>([
        {
            name: TemplateType.login,
            template: () => import('./modules/login'),
            content: '',
        },
        {
            name: TemplateType.phoneLogin,
            template: () => import('./modules/phoneLogin'),
            content: '',
        },
        {
            name: TemplateType.verification,
            template: () => import('./modules/verification'),
            content: '',
        },
        {
            name: TemplateType.sendTransaction,
            template: () => import('./modules/sendTransaction'),
            content: '',
        },
        {
            name: TemplateType.gasFee,
            template: () => import('./modules/gasFee'),
            content: '',
        },
        {
            name: TemplateType.transactionPaymentPassword,
            template: () => import('./modules/transactionPaymentPassword'),
            content: '',
        },
        {
            name: TemplateType.setpaymentPassword,
            template: () => import('./modules/setpaymentPassword'),
            content: '',
        },
        {
            name: TemplateType.signMessage,
            template: () => import('./modules/signMessage'),
            content: '',
        },
        {
            name: TemplateType.verificationDetails,
            template: () => import('./modules/verificationDetails'),
            content: '',
        },
        {
            name: TemplateType.accountSecurity,
            template: () => import('./modules/accountSecurity'),
            content: '',
        },
        {
            name: TemplateType.authorization,
            template: () => import('./modules/authorization'),
            content: '',
        },

        {
            name: TemplateType.linkAccounts,
            template: () => import('./modules/linkAccounts'),
            content: '',
        },
        {
            name: TemplateType.setMasterPassword,
            template: () => import('./modules/setMasterPassword'),
            content: '',
        },
        {
            name: TemplateType.confirmationModal,
            template: () => import('./modules/confirmationModal'),
            content: '',
        },
    ]);

    useEffect(() => {
        (async () => {
            for (let i = 0; i < templates.length; i++) {
                const { template } = templates[i];
                let content = await template();
                content = Buffer.from(content.template, 'base64').toString() + styleContent;
                templates[i] = {
                    ...templates[i],
                    content,
                };

                setTemplates([...templates]);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <div ref={containerRef} className={`${styles.container} templates-container`} data-loading={loading}>
            {templates.map((item: any, index: number) => {
                return (
                    <div key={index} className="item" data-name={item.name}>
                        <iframe srcDoc={item.content} />
                    </div>
                );
            })}
        </div>
    );
};

export default Template;
