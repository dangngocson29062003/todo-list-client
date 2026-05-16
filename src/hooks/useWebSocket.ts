// import { useEffect, useRef, useState } from "react";
// import { websocketService } from "../service/websocket-service";

// export const useWebSocket = (onMessage?: (message: any) => void) => {
//   const [connected, setConnected] = useState(false);
//   const onMessageRef = useRef(onMessage);
//   const subscriptionRef = useRef<any>(null);

//   useEffect(() => {
//     onMessageRef.current = onMessage;
//   }, [onMessage]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     websocketService.connect(token, () => {
//       setConnected(true);

//       subscriptionRef.current = websocketService.subscribe(
//         "/user/queue/messages",
//         (message) => onMessageRef.current?.(message),
//       );
//     });

//     return () => {
//       subscriptionRef.current?.unsubscribe();
//       websocketService.disconnect();
//       setConnected(false);
//     };
//   }, []);
// };
