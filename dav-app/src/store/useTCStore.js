import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useTcStore = create((set) => ({
  tcList: [],
  prevTcList: [],
  loading: false,
  date: "",
  fetchTcs: async (newDate) => {
    set({ loading: true });
    set((state) => ({prevTcList: state.tcList}))
    set({ tcList: [] });
    axios.get(`${BASE_URL}tc/byDate/${newDate}`)
      .then(res => set({ tcList: res.data }))
      .catch(err => console.log(err))
      .finally(() => {
        set({ loading: false });
        set({ date: newDate });
      });
  },
}));

export default useTcStore;