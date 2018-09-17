function mapStateToProps(state, otherProps) {
  return { ...otherProps };
}

function mapDispatchToProps(dispatch) {
  return {
    undefined: async () => dispatch(),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
