import type { PrefixedHexString, ToBufferInputTypes } from '@ethereumjs/util';
import { bufferToHex, isHexString, toBuffer } from '@ethereumjs/util';
import { connect, disconnect } from '@particle-network/auth-core';
import { message } from 'antd';
import base64url from 'base64url';
import { EventEmitter } from 'events';
import qs from 'qs';

function base64urlDecode(base64url: string): string {
    // 替换 base64url 字符到标准 base64 字符
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

    // 补齐 base64 字符串
    switch (base64.length % 4) {
        case 2:
            base64 += '==';
            break;
        case 3:
            base64 += '=';
            break;
    }

    return atob(base64);
}

export const thirdpartyLogin = async () => {
    try {
        const query = qs.parse(window.location.search, {
            ignoreQueryPrefix: true,
        });
        const particleThirdpartyParamsContent = query?.particleThirdpartyParams as string;
        if (!particleThirdpartyParamsContent) {
            return;
        }

        delete query.particleThirdpartyParams;
        const replaceUrl = (window.location.origin + window.location.pathname + '?' + qs.stringify(query)).replace(
            /\?$/,
            ''
        );
        window.history.replaceState({}, document.title, replaceUrl);
        document.title = document.title || replaceUrl;
        const particleThirdpartyParams = JSON.parse(base64urlDecode(particleThirdpartyParamsContent));

        const { code, nonce, appState, error } = particleThirdpartyParams;
        const appStateObj = appState ? JSON.parse(base64url.decode(appState as string)) : {};
        const { authorization, chain } = appStateObj;

        if (error) {
            disconnect();
            return;
        }

        const authType = nonce.split('@')[0];
        await connect({ socialType: authType, code, nonce, authorization, chain });
        return true;
    } catch (error: any) {
        console.error('after redirect, login or bind', error?.message || error);
        message.error(error?.message || error);
    }
};

export const getEVMPublicAddress = (): string => {
    return window.particleAuth?.ethereum.selectedAddress || '';
};

export const eventBus = new EventEmitter();

export function legacyToBuffer(value: ToBufferInputTypes) {
    return typeof value === 'string' && !isHexString(value) ? Buffer.from(value) : toBuffer(value);
}

export function toHexPrefixString(value: ToBufferInputTypes): PrefixedHexString {
    if (typeof value === 'string' && isHexString(value)) {
        return value;
    } else {
        return bufferToHex(legacyToBuffer(value));
    }
}

export function shortString(str: string): string {
    if (Array.isArray(str)) {
        str = '[' + str.toString() + ']';
    }
    if (str) {
        if (typeof str.toString === 'function') {
            str = str.toString();
        }
        if (str.length <= 10) {
            return str;
        }
        return `${str.slice(0, 5)}...${str.slice(str.length - 5, str.length)}`;
    }
    return '';
}
