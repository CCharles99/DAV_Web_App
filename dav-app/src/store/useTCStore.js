import { create } from 'zustand';
import axios from 'axios';

const useTcStore = create((set) => ({
  tcList: [],
  prevTcList: [],
  loading: false,
  date: "",
  fetchTcs: async (newDate) => {
    set({ loading: true });
    set((state) => ({prevTcList: state.tcList}))
    set({ tcList: [] });
    axios.get(`http://localhost:5000/tc/byDate/${newDate}`)
      .then(res => set({ tcList: res.data }))
      .catch(err => console.log(err))
      .finally(() => {
        set({ loading: false });
        set({ date: newDate });
      });
  },
}));

export default useTcStore;