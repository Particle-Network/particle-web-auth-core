import { useEffect, useState } from 'react';
import { createIcon } from './blockies';

function AccountAvatar(props: any) {
    const priCanvas = document.createElement('canvas');
    const [canvas] = useState(priCanvas);
    const [wallImg, setWallImg] = useState('');
    const size = (props?.opts?.size || 10) * (props?.opts?.scale || 8);

    function getOpts() {
        return {
            seed: props?.opts?.seed || 'foo',
            color: props?.opts?.color || '#dfe',
            bgcolor: props?.opts?.bgcolor || '#a71',
            size: props?.opts?.size || 15,
            scale: props?.opts?.scale || 3,
            spotcolor: props?.opts?.spotcolor || '#000',
        };
    }

    useEffect(() => {
        const img = createIcon(getOpts(), canvas).toDataURL();
        setWallImg(img);
    }, [props, canvas]);
    return <img src={wallImg} style={{ height: size, width: size }}></img>;
}

export default AccountAvatar;
