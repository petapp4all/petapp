import { createSlice } from "@reduxjs/toolkit";
import { stations } from "@/src/components/utils/utils";

const initialState = {
  stations: stations,
  filteredStations: stations,
};

const stationSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    searchStations: (state, action) => {
      if (!action.payload.trim()) {
        state.filteredStations = state.stations;
        return;
      }
      const query = action.payload.toLowerCase();
      state.filteredStations = state.stations.filter((station) =>
        station.name.toLowerCase().includes(query)
      );
    },
  },
});

export const { searchStations } = stationSlice.actions;
export default stationSlice.reducer;
