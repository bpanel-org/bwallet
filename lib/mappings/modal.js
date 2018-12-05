import {
  setModal,
} from '../actions';

function mapStateToProps(state, otherProps) {
  return {
    ...otherProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // always turn off modal from this view
    setModal: () => dispatch(setModal(false)),
  }
}

export default {
  mapStateToProps,
  mapDispatchToProps,
}
