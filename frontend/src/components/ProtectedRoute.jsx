function ProtectedRoute({ children }) {
  const { userLoggedIn } = useContext(AuthContext);

  if (!userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;