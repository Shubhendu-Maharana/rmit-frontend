import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCredentials, clearCredentials } from "../store/slices/authSlice";
import { DatabaseUser } from "@app/types/users";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const login = (userData: DatabaseUser, jwtToken: string) => {
    dispatch(setCredentials({ user: userData, token: jwtToken }));
  };

  const logout = () => {
    dispatch(clearCredentials());
  };

  return {
    session: token ? { token, user: user as DatabaseUser } : null,
    user,
    isLoading,
    databaseUser: user,
    login,
    logout,
  };
};
