import { useState, useEffect } from 'react';
import { subscribeEmpresas, addEmpresaDoc, removeEmpresaDoc } from '../services';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = subscribeEmpresas((items) => {
      setEmpresas(items);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  const addEmpresa = async (name) => {
    return await addEmpresaDoc(name);
  };

  const removeEmpresa = async (id) => {
    await removeEmpresaDoc(id);
  };

  return { empresas, loaded, addEmpresa, removeEmpresa };
};
