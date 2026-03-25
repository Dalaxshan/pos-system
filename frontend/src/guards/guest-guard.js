import PropTypes from 'prop-types';

export const GuestGuard = (props) => {
  const { children } = props;

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // not authenticated / authorized.

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};
