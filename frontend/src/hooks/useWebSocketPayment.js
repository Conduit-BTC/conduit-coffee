// hooks/useWebSocketPayment.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocketPayment(invoiceId) {
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [receipt, setReceipt] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;

    const connectWebSocket = useCallback(() => {
        try {
            const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
            if (!wsUrl) {
                throw new Error('WARNING: Connection to the server is not available, please reload the page');
            }

            socketRef.current = new WebSocket(wsUrl);
            console.log('Attempting WebSocket connection...');

            socketRef.current.onopen = () => {
                setConnectionStatus('connected');
                setError(null);
                reconnectAttemptsRef.current = 0;
                console.log('WebSocket connected, watching invoice:', invoiceId);

                // Send watch request
                socketRef.current.send(JSON.stringify({
                    type: 'WATCH_INVOICE',
                    invoiceId: invoiceId
                }));
            };

            socketRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    switch (data.type) {
                        case 'CONNECTED':
                            console.log('Connection acknowledged by server');
                            break;
                        case 'WATCHING_CONFIRMED':
                            console.log('Server confirmed watching invoice:', data.invoiceId);
                            break;
                        case 'PAYMENT_RECEIVED':
                            if (data.invoiceId === invoiceId) {
                                console.log('Payment received for invoice:', data.invoiceId);
                                setPaymentStatus('paid');
                                setReceipt(data.receipt);
                                if (socketRef.current) {
                                    socketRef.current.close();
                                }
                            }
                            break;
                        case 'ERROR':
                            console.error('Server error:', data.message);
                            setError(data.message);
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    setError('Failed to parse server message');
                }
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('error');
                setError('WebSocket connection error');
            };

            socketRef.current.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setConnectionStatus('disconnected');

                if (paymentStatus === 'pending' && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttemptsRef.current += 1;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
                    console.log(`Attempting reconnect ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);
                    reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
                } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
                    setError('Maximum reconnection attempts reached');
                }
            };

        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
            setConnectionStatus('error');
            setError(error.message);
        }
    }, [invoiceId, paymentStatus, receipt]);

    useEffect(() => {
        if (!invoiceId) {
            setError('Invoice ID is required');
            return;
        }

        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [invoiceId, connectWebSocket]);

    return {
        receipt,
        paymentStatus,
        connectionStatus,
        isConnected: connectionStatus === 'connected',
        error
    };
}
