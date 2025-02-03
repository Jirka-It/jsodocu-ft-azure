import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        showModal: false,
        showGuardModal: false
    },
    reducers: {
        setShowModal: (state, action) => void (state.showModal = action.payload),
        setShowGuardModal: (state, action) => void (state.showGuardModal = action.payload)
    }
});

export const { setShowModal, setShowGuardModal } = modalSlice.actions;
export default modalSlice.reducer;
