import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Inventory Manager" | "Support Specialist" | "Marketing Lead";
  status: "Active" | "Inactive";
  joinedDate: string;
  avatar?: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedRoleFilter: string;
}

const initialState: EmployeeState = {
  employees: [
    { id: "EMP-001", name: "Alexander Pierce", email: "alexander@apex.store", role: "Super Admin", status: "Active", joinedDate: "Jan 2024" },
    { id: "EMP-002", name: "Sarah Jenkins", email: "sarah.j@apex.store", role: "Inventory Manager", status: "Active", joinedDate: "Feb 2024" },
    { id: "EMP-003", name: "Michael Chen", email: "michael.c@apex.store", role: "Support Specialist", status: "Active", joinedDate: "Mar 2024" },
    { id: "EMP-004", name: "Emily Watson", email: "emily.w@apex.store", role: "Marketing Lead", status: "Inactive", joinedDate: "Apr 2024" },
  ],
  selectedRoleFilter: "all",
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.unshift(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const idx = state.employees.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) {
        state.employees[idx] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    },
    toggleEmployeeStatus: (state, action: PayloadAction<string>) => {
      const emp = state.employees.find((e) => e.id === action.payload);
      if (emp) {
        emp.status = emp.status === "Active" ? "Inactive" : "Active";
      }
    },
    setSelectedRoleFilter: (state, action: PayloadAction<string>) => {
      state.selectedRoleFilter = action.payload;
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  setSelectedRoleFilter,
} = employeeSlice.actions;

export default employeeSlice.reducer;
