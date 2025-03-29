import { userData } from "@/src/components/utils/utils";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: userData,
  filteredUsers: userData,
  sortBy: null,
  sortOrder: "asc",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    searchUsers: (state, action) => {
      if (!action.payload.trim()) {
        state.filteredUsers = state.users;
        return;
      }
      const query = action.payload.toLowerCase();
      state.filteredUsers = state.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query)
      );
    },

    sortUsers: (state, action) => {
      const { field } = action.payload;
      if (state.sortBy === field) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = field;
        state.sortOrder = "asc";
      }

      state.filteredUsers = [...state.filteredUsers].sort((a, b) => {
        const valueA = a[field]?.toString().toLowerCase();
        const valueB = b[field]?.toString().toLowerCase();

        if (valueA < valueB) return state.sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return state.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    },

    deleteUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
      state.filteredUsers = state.filteredUsers.filter(
        (user) => user.id !== userId
      );
    },
  },
});

export const { searchUsers, sortUsers, deleteUser } = userSlice.actions;
export default userSlice.reducer;
