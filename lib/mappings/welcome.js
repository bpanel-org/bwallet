import { selectApplication } from './selectors';

function mapStateToProps(state, otherProps) {
  const app = selectApplication(state);
  const uri = `${app.protocol}//${app.hostname}:${app.port}`;
  return {
    uri,
    ...otherProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
