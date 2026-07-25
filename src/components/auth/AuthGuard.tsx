import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useGetMeQuery } from "../../store/api/authApi";
import { setUser, clearCredentials } from "../../store/slices/authSlice";
import { Navigate } from "react-router";
import { authApi } from "../../store/api/authApi";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard wraps protected routes. On mount, if a token exists,
 * it calls /users/me to verify the token and fetch the real user
 * object from the server — preventing stale role data from being
 * used in the sidebar/dashboard.
 *
 * The user object is NEVER persisted to localStorage. Only the token
 * is persisted. This ensures that on every login / app reload,
 * the user is always fetched fresh from the server.
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  // Skip the query if there's no token — user is not logged in
  // refetchOnMountOrArgChange ensures we always get fresh data
  const { data, error, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data) {
      // Replace the locally-stored user with the server-verified one
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      // Token is expired/invalid — clear everything and force logout
      dispatch(clearCredentials());
      // Also reset the getMe cache so next login starts fresh
      dispatch(authApi.util.resetApiState());
    }
  }, [error, dispatch]);

  // No token at all — redirect to login
  if (!token) {
    return <Navigate to="/adminlogin" replace />;
  }

  // Still verifying the token — show a loading state
  // Wait until we have a user object before rendering children
  if (isLoading || isFetching || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // Token was invalid — error effect will clear credentials,
  // next render will hit the !token check above
  if (error) {
    return <Navigate to="/adminlogin" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
