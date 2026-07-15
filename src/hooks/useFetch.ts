import {notification} from 'antd';
import {useCallback, useState} from "react";

import {backendBase} from "../constants/backendBase";
import {IUseFetchProps} from "./types/IUseFetchProps";

export const useFetch = <R>({url}: IUseFetchProps) => {
    const [result, setResult] = useState<R>();
    const [loading, setLoading] = useState<boolean>(true);

    const request = useCallback(() => {
        setLoading(true);
        fetch(backendBase + url).then((response) => response.json()).then((data) => {
            setLoading(false);
            setResult(data);
        }).catch((error) => {
            setLoading(false);
            notification.error(error.message);
        });
    }, [url]);

    return {
        result,
        loading,
        request
    }
}