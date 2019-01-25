import { selectApplication } from './selectors';

function mapStateToProps(state, otherProps) {
  const app = selectApplication(state);
  let uri = '';
  if (app) uri = `${app.protocol}//${app.hostname}:${app.port}`;
  return {
    uri,
    ...otherProps,
  };
}

function mapDispatchToProps() {
  return {};
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
