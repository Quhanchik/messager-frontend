import { useEffect, useRef } from "react"
import React from 'react';

const useSubscription = (subs, clientRef) => {
    const isInitRef = useRef(true);

    useEffect(() => {
        if(isInitRef.current) {
            isInitRef.current = false;
        } else {
            subs.forEach(elem => {
                console.log(clientRef);
                clientRef.current.subscribe(elem, (msg) => {
                    console.log(JSON.parse(msg.body));
                })    
            })
        }
    })
}

export default useSubscription;