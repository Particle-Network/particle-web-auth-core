import { useRef } from 'react';
import Header from '../Header';
import styles from './index.module.scss';
import Setting from './modules/setting';
import Templates from './modules/templates';

const Customize = () => {
    const iframeContentRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.container}>
            <Header pathName="Customize" />
            <div className="container-wrapper">
                <div className="container-left" ref={iframeContentRef}>
                    <Templates />
                </div>
                <div className="container-right">
                    <Setting iframeContentRef={iframeContentRef} />
                </div>
            </div>
        </div>
    );
};

export default Customize;
