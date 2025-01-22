import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        inReview: 1,
        inEdition: 1
    },
    reducers: {
        setInReview: (state, action) => void (state.inReview = action.payload),
        setInEdition: (state, action) => void (state.inEdition = action.payload),
        addInReview: (state) => void (state.inReview += 1),
        addInEdition: (state) => void (state.inEdition += 1),
        subInReview: (state) => {
            if (state.inReview === 0) {
                state.inReview = 0;
            } else {
                state.inReview -= 1;
            }
        },
        subInEdition: (state) => {
            if (state.inEdition === 0) {
                state.inEdition = 0;
            } else {
                state.inEdition -= 1;
            }
        }
    }
});

export const { setInReview, setInEdition, addInReview, addInEdition, subInReview, subInEdition } = menuSlice.actions;
export default menuSlice.reducer;
