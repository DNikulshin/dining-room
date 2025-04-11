'use client';

import { handleExportToExcel } from '@/shared/utils/exportToExcel';
import { IActionKey, IMenu, IResultItems } from '@/types/types';
import { useState, useEffect, useRef, useCallback } from 'react';

const escape: IActionKey = {
  name: 'Сброс заказа',
  key: 'Escape',
};

const clearAll: IActionKey = {
  name: 'Сброс результатов',
  key: 'f5',
};

const exportToExcel: IActionKey = {
  name: 'Экспорт в Excel',
  key: 'f6',
};

const menu: IMenu[] = [
  { id: 1, name: 'Первое', price: 25, key: 'f1' },
  { id: 2, name: 'Второе', price: 75, key: 'f2' },
  { id: 3, name: 'Салат/Десерт', price: 35, key: 'f3' },
  { id: 4, name: 'Комплекс', price: 150, key: 'f4' },
];

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: { id: number; quantity: number; price: number; } }>({});
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [resultItems, setResultItems] = useState<IResultItems>([]);
  
  const resetOrder = useCallback(() => {
    setTotal(0);
    setSelectedItems({});
    setUserId('');
    setIsOrderCompleted(false);
  }, []);

  const handleConfirmOrder = useCallback(() => {
    if (userId && Object.keys(selectedItems).length > 0) {
      const newOrder = {
        userId,
        order: { ...selectedItems },
        total,
        createdAt: new Date().toLocaleString(),
      };
      const updatedResults = [...resultItems, newOrder];
      localStorage.setItem('resultItems', JSON.stringify(updatedResults));
      setResultItems(updatedResults);
    }
    resetOrder();
  }, [userId, selectedItems, total, resetOrder, resultItems]);

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem('resultItems');
    setResultItems([]);
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const isShiftPressed = event.shiftKey;

    if (key === exportToExcel.key.toUpperCase()) {
      event.preventDefault();
      if (key === exportToExcel.key.toUpperCase() && isShiftPressed) {
        handleExportToExcel(resultItems);
        setTimeout(() => setPressedKey(null), 200);
        return;
      }
    }

    if (key === clearAll.key.toUpperCase()) {
      event.preventDefault();
      if (key === clearAll.key.toUpperCase() && isShiftPressed) {
        clearLocalStorage();
        setTimeout(() => setPressedKey(null), 200);
        return;
      }
    }

    if (key === escape.key.toUpperCase()) {
      event.preventDefault();
      resetOrder();
      setPressedKey(escape.key.toUpperCase());
      setTimeout(() => setPressedKey(null), 200);
      return;
    }

    if (key === 'ENTER') {
      event.preventDefault();
      if (isOrderCompleted) {
        handleConfirmOrder();
      }
      return;
    }

    const menuItem = menu.find(item => item.key.toUpperCase() === key);
    if (menuItem) {
      event.preventDefault();
      setPressedKey(key);
      setTotal(prevTotal => prevTotal + menuItem.price);
      setSelectedItems(prevItems => ({
        ...prevItems,
        [menuItem.name]: {
          id: menuItem.id,
          quantity: (prevItems[menuItem.name]?.quantity || 0) + 1,
          price: menuItem.price
        }
      }));
      setTimeout(() => setPressedKey(null), 200);
    }
  }, [isOrderCompleted, resetOrder, handleConfirmOrder, clearLocalStorage, resultItems]);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);
    setSelectedItems(prev => Object.fromEntries(
      Object.entries(prev).map(([item, { id, quantity, price }]) => [item, { id, quantity, price }]))
    );
  };

  const updateOrderCompletionStatus = () => {
    const isCompleted = total > 0;
    setIsOrderCompleted(isCompleted);
    if (isCompleted && inputRef.current) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    }
  };

  useEffect(updateOrderCompletionStatus, [total]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const storedResults = localStorage.getItem('resultItems');
    if (storedResults) {
      setResultItems(JSON.parse(storedResults));
    }
  }, []);


  return (
    <div className="flex flex-col h-screen items-center px-2 py-2 container mx-auto">
      <button className="bg-yellow-500 px-4 py-2 shadow-md shadow-slate-400 cursor-pointer rounded absolute left-10 top-4">{exportToExcel.name}: (shift+{exportToExcel.key.toUpperCase()})</button>
      <div className='flex gap-4 items-center justify-center py-2'>
        <div className='text-2xl font-bold'>Заказов: (<span className='text-red-500 '>{resultItems.length}</span>)
        </div>
        <button className="bg-slate-400 px-2 py-2 shadow-md shadow-slate-400 cursor-pointer rounded">{clearAll.name}: (shift+{clearAll.key.toUpperCase()})</button>
      </div>

      <div className="flex flex-wrap gap-10 items-center justify-center py-12 px-4 shadow-md shadow-slate-500 w-full relative">

        <input
          ref={inputRef}
          className={`absolute top-2 right-8 z-50 shadow-md shadow-slate-500 px-4 py-2 outline-none disabled:bg-gray-300/85 ${userId ? '' : 'border border-red-400'}`}
          type='number'
          placeholder='Введите ID'
          onChange={handleUserIdChange}
          value={userId}
          autoFocus={isOrderCompleted}
          disabled={!isOrderCompleted}
        />

        {menu.map(({ id, name, price, key }) => (
          <div key={id} className="flex flex-col gap-2 justify-center items-center py-4">
            <strong>{name}</strong>
            {price && <p className='text-lg'>(<span className='text-red-400'>{price}р</span>)</p>}
            <button
              className={`bg-green-500 px-8 py-4 shadow-md shadow-slate-400 cursor-pointer rounded-sm w-[100px] min-h-[150px] ${pressedKey === key.toUpperCase() ? 'key-pressed' : ''}`}
            >
              {key.toUpperCase()}
            </button>
          </div>
        ))}
        <div className='flex flex-col gap-2 justify-center items-center min-h-[200px]'>
          <strong className='text-red-400'>{escape.name}</strong>
          <button
            className={`bg-green-500 px-8 py-4 shadow-md shadow-slate-400 cursor-pointer rounded-sm w-[100px] min-h-[150px] ${pressedKey === escape.key.toUpperCase() ? 'key-pressed' : ''}`}
          >
            <span className='font-bold'>Esc</span>
          </button>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-4 flex flex-col gap-4 shadow-md shadow-slate-500 px-4 py-2 w-full justify-center items-center">
          <h2 className='text-xl'>Выбранные блюда:</h2>
          <ul className='flex flex-col gap-4 justify-center items-center w-full'>
            {Object.entries(selectedItems).map(([item, { quantity, price }]) => (
              <li key={item} className='px-4 py-2 shadow-md shadow-slate-500 flex justify-center items-center w-full'>
                <span className='text-lg flex gap-1'>
                  {item} (x{quantity}) - <span className='text-red-400'>{price * quantity}</span>р.
                </span>
              </li>
            ))}
          </ul>
          <h2 className='flex gap-2 items-center text-xl'>Итоговая сумма: <strong className='text-red-400 text-3xl'>{total}</strong>р.</h2>
          {userId && (
            <>
              <span>(User ID: {userId})</span>
              <button onClick={handleConfirmOrder} className="bg-red-400 px-8 py-4 shadow-md shadow-slate-400 cursor-pointer mt-4 mb-4 rounded">Подтвердить заказ (Enter)</button>
            </>
          )}
        </div>
      )}
      <div className='mt-4 flex flex-col gap-4 justify-center items-start word-break'>
        {
          resultItems && resultItems.map((item, idx) => (
            <div key={item.userId}>
              ({idx + 1}) -  {' '}{JSON.stringify(item)}
            </div>
          ))
        }
      </div>

    </div>
  );
}
