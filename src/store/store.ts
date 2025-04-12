// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { IResultItems } from '@/types/types';

// interface StoreState {
//     userId: string;
//     total: number;
//     selectedItems: { [key: string]: { id: number; quantity: number; price: number } };
//     resultItems: IResultItems;
//     isOrderCompleted: boolean;
//     setUserId: (id: string) => void;
//     resetOrder: () => void;
//     addItem: (item: { id: number; name: string; price: number }) => void;
//     removeItem: (name: string) => void;
//     confirmOrder: () => void;
//     clearLocalStorage: () => void;
// }

// export const useStore = create<StoreState>()(
//     persist(
//         (set) => ({
//             userId: '',
//             total: 0,
//             selectedItems: {},
//             resultItems: [],
//             isOrderCompleted: false,
//             setUserId: (id) => set({ userId: id }),
//             resetOrder: () => set({ userId: '', total: 0, selectedItems: {}, isOrderCompleted: false }),
//             addItem: (item) => set((state) => {
//                 const prevTotal = state.total + item.price;
//                 const prevItems = { ...state.selectedItems };
//                 if (prevItems[item.name]) {
//                     prevItems[item.name].quantity += 1;
//                 } else {
//                     prevItems[item.name] = { id: item.id, quantity: 1, price: item.price };
//                 }
//                 return { total: prevTotal, selectedItems: prevItems, isOrderCompleted: prevTotal > 0 };
//             }),
//             removeItem: (name) => set((state) => {
//                 const prevItems = { ...state.selectedItems };
//                 const itemToRemove = prevItems[name];

//                 if (itemToRemove) {
//                     const updatedTotal = state.total - (itemToRemove.price * itemToRemove.quantity);
//                     delete prevItems[name];
//                     return {
//                         total: updatedTotal,
//                         selectedItems: prevItems,
//                         isOrderCompleted: updatedTotal > 0,
//                     };
//                 }
//                 return state;
//             }),
//             confirmOrder: () => set((state) => {
//                 const newOrder = {
//                     userId: state.userId,
//                     order: { ...state.selectedItems },
//                     total: state.total,
//                     createdAt: new Date().toLocaleString(),
//                 };
//                 const updatedResults = [...state.resultItems, newOrder];
//                 localStorage.setItem('resultItems', JSON.stringify(updatedResults));

//                 return {
//                     resultItems: updatedResults,
//                     userId: '',
//                     total: 0,
//                     selectedItems: {},
//                     isOrderCompleted: false
//                 };
//             }),
//             clearLocalStorage: () => {
//                 localStorage.removeItem('resultItems');
//                 set({ resultItems: [] });
//             },
//         }),
//         {
//             name: 'order-storage'
//         }
//     )
// );
