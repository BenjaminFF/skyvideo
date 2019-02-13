const state={
  UserEvents: [],
  wsAdmin:{},
  deviceList:[],
}

const mutations={
  updateUserEvents(State,UserEvents){
    State.UserEvents=UserEvents;
  },
  setwsAdmin(State,wsAdmin){
    State.wsAdmin=wsAdmin;
  },
  updateDeviceList(State,deviceList){
    State.deviceList=deviceList;
  },
}


export default {
  namespaced: true,
  mutations,
  state,
}
