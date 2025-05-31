import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStations, getStationById } from "@/src/components/utils/station";

// Async thunk: fetch all stations
export const fetchStations = createAsyncThunk(
  "stations/fetchStations",
  async () => {
    const data = await getStations();
    return data;
  }
);

// Async thunk: fetch station by ID (optional, if needed)
export const fetchStationById = createAsyncThunk(
  "stations/fetchStationById",
  async (id) => {
    const data = await getStationById(id);
    return data;
  }
);

// Initial state
const initialState = {
  stations: [],
  filteredStations: [],
  selectedStation: null,
  loading: false,
  error: null,
};

const stationSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    searchStations: (state, action) => {
      const query = action.payload.trim().toLowerCase();
      if (!query) {
        state.filteredStations = state.stations;
        return;
      }
      state.filteredStations = state.stations.filter((station) =>
        station.name.toLowerCase().includes(query)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.stations = action.payload;
        state.filteredStations = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStationById.pending, (state) => {
        state.selectedStation = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationById.fulfilled, (state, action) => {
        state.selectedStation = action.payload;
        state.loading = false;
      })
      .addCase(fetchStationById.rejected, (state, action) => {
        state.selectedStation = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { searchStations } = stationSlice.actions;
export default stationSlice.reducer;
