import {
  getAllUsers,
  getUserById,
  deleteUserById,
  unblockUser,
  blockUser,
} from "@/src/components/utils/auth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk: fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const users = await getAllUsers();
  return users;
});

// Async thunk: fetch single user
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async () => {
    const user = await getUserById();
    return user;
  }
);

// Async thunk: delete user
export const removeUserById = createAsyncThunk(
  "users/removeUserById",
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUserById(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Block user
export const blockUserById = createAsyncThunk(
  "users/blockUserById",
  async (userId, { rejectWithValue }) => {
    try {
      await blockUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Unblock user
export const unblockUserById = createAsyncThunk(
  "users/unblockUserById",
  async (userId, { rejectWithValue }) => {
    try {
      await unblockUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  users: [],
  filteredUsers: [],
  selectedUser: null,
  sortBy: null,
  sortOrder: "asc",
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsers: (state) => {
      state.filteredUsers = state.users;
      state.sortBy = null;
      state.sortOrder = null;
    },
    searchUsers: (state, action) => {
      const query = action.payload.trim().toLowerCase();

      if (!query) {
        state.filteredUsers = state.users;
        return;
      }

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
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.filteredUsers = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch single user
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.selectedUser = null;
        state.error = action.error.message;
      })

      // Delete user
      .addCase(removeUserById.fulfilled, (state, action) => {
        const userId = action.payload;
        state.users = state.users.filter((user) => user.id !== userId);
        state.filteredUsers = state.filteredUsers.filter(
          (user) => user.id !== userId
        );
        state.error = null;
      })
      .addCase(removeUserById.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete user";
      })
      // Block user
      .addCase(blockUserById.fulfilled, (state, action) => {
        const userId = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) user.isBlocked = true;

        const filteredUser = state.filteredUsers.find((u) => u.id === userId);
        if (filteredUser) filteredUser.isBlocked = true;

        state.error = null;
      })
      .addCase(blockUserById.rejected, (state, action) => {
        state.error = action.payload || "Failed to block user";
      })

      // Unblock user
      .addCase(unblockUserById.fulfilled, (state, action) => {
        const userId = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) user.isBlocked = false;

        const filteredUser = state.filteredUsers.find((u) => u.id === userId);
        if (filteredUser) filteredUser.isBlocked = false;

        state.error = null;
      })
      .addCase(unblockUserById.rejected, (state, action) => {
        state.error = action.payload || "Failed to unblock user";
      });
  },
});

export const { resetUsers, searchUsers, sortUsers } = userSlice.actions;
export default userSlice.reducer;
