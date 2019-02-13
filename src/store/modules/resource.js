const state={
  curUri:"",
  curResource:null,
  resourceSelected:false
}

const mutations={
  setCurUri(state,curUri){
    state.curUri=curUri;
  },
  setCurResource(state,resource){
    state.curResource=resource;
  },
  setSelected(state,resourceSelected) {
    state.resourceSelected=resourceSelected;
  }
}


export default {
  namespaced: true,
  mutations,
  state,
}
