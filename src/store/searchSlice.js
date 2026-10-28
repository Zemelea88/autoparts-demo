import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { searchBrands, searchOffers } from '../api/favorit'

const emptyRequest = { status: 'idle', items: [], error: null, requestId: null }

const initialState = {
  query: '',
  selected: null,
  brands: emptyRequest,
  offers: emptyRequest,
}

export const fetchBrands = createAsyncThunk('search/fetchBrands', async (number, { rejectWithValue }) => {
  try {
    return await searchBrands(number)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchOffers = createAsyncThunk('search/fetchOffers', async ({ number, brand }, { rejectWithValue }) => {
  try {
    return await searchOffers(number, brand)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const isLatest = (slot, action) => slot.requestId === action.meta.requestId

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.query = action.meta.arg
        state.selected = null
        state.brands = { ...emptyRequest, status: 'loading', requestId: action.meta.requestId }
        state.offers = emptyRequest
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (!isLatest(state.brands, action)) return
        state.brands.status = 'succeeded'
        state.brands.items = action.payload
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (!isLatest(state.brands, action)) return
        state.brands.status = 'failed'
        state.brands.error = action.payload ?? action.error.message
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.selected = action.meta.arg
        state.offers = { ...emptyRequest, status: 'loading', requestId: action.meta.requestId }
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (!isLatest(state.offers, action)) return
        state.offers.status = 'succeeded'
        state.offers.items = action.payload
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (!isLatest(state.offers, action)) return
        state.offers.status = 'failed'
        state.offers.error = action.payload ?? action.error.message
      })
  },
})

export const { resetSearch } = searchSlice.actions
export default searchSlice.reducer
