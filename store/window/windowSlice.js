import { createSlice } from "@reduxjs/toolkit";

import HelloWorld from "../../components/windows/HelloWorld";

function getActualIndex(state, fakeIndex) {
  return state.map((window) => window.index).indexOf(fakeIndex);
}

export const windowSlice = createSlice({
  name: "windows",
  initialState: [],
  reducers: {
    newWindow: (state, action) => {
      // we set the property isOnTop to false for all windows
      state.forEach((window) => {
        window.isOnTop = false;
      });

      state.push({
        title: action?.payload?.title || "Hello World",
        component: action?.payload?.component || HelloWorld,
        icon: action?.payload?.icon || null,
        size: {
          x: action?.payload?.size?.x || 300,
          y: action?.payload?.size?.y || 91,
        },
        position: {
          x: action?.payload?.position?.x || (state.length + 1) * 24,
          y: action?.payload?.position?.y || (state.length + 1) * 24,
        },
        minimized: action?.payload?.minimized || false,
        maximized: action?.payload?.maximized || false,
        zIndex: state.length,
        index: state.length,
        isOnTop: true, // since this is a new window, it's automatically on top
      });
    },
    closeWindow: (state, action) => {
      const fakeIndex = action.payload;
      const index = getActualIndex(state, fakeIndex);
      state.splice(index, 1);
    },
    setTitle: (state, action) => {
      const { index: fakeIndex, newProp } = action.payload;
      const index = getActualIndex(state, fakeIndex);
      state[index].title = newProp;
    },
    setIcon: (state, action) => {
      const { index: fakeIndex, newProp } = action.payload;
      const index = getActualIndex(state, fakeIndex);
      state[index].icon = newProp;
    },
    setSize: (state, action) => {
      const {
        index: fakeIndex,
        newProp: { x, y },
        override,
      } = action.payload;
      const index = getActualIndex(state, fakeIndex);
      if (state[index]) {
        if (override) {
          state[index].size.x = x;
          state[index].size.y = y;
        } else {
          state[index].size.x += x;
          state[index].size.y += y;
        }
      }
    },
    setPosition: (state, action) => {
      const {
        index: fakeIndex,
        newProp: { x, y },
        override,
      } = action.payload;
      const index = getActualIndex(state, fakeIndex);
      if (state[index]) {
        if (override) {
          state[index].position.x = x;
          state[index].position.y = y;
        } else {
          state[index].position.x += x;
          state[index].position.y += y;
        }
      }
    },
    toggleMinimize: (state, action) => {
      const fakeIndex = action.payload;
      const index = getActualIndex(state, fakeIndex);
      state[index].minimized = !state[index].minimized;
    },
    toggleMaximize: (state, action) => {
      const fakeIndex = action.payload;
      const index = getActualIndex(state, fakeIndex);
      state[index].maximized = !state[index].maximized;
    },
    bringToFront: (state, action) => {
      const fakeIndex = action.payload;
      const index = getActualIndex(state, fakeIndex);

      // we set the property isOnTop to false for all windows
      state.forEach((window) => {
        window.isOnTop = false;
      });

      // If the window we're trying to bring to front hasn't been closed
      if (state[index]) {
        // make an array of all windows with a zIndex higher than the window to bring to front
        const windowsToBeModified = state.filter((window) => {
          return window.zIndex > state[index]?.zIndex;
        });

        // get all of the indexes (in the state array) of the windows to be sent backwards
        const indexesOfWindowsToBeModified = windowsToBeModified.map(
          (window) => {
            return state
              .map((stateWindow) => stateWindow.zIndex)
              .indexOf(window.zIndex);
          }
        );

        // for each window to be modified, subtract 1 from the zIndex to send backwards
        indexesOfWindowsToBeModified.forEach((indexToModify) => {
          state[indexToModify].zIndex -= 1;
        });

        // set the zIndex of the window to be in front, set isOnTop to true
        state[index].zIndex = state.length - 1;
        state[index].isOnTop = true;
      }
    },
  },
});

export const selectWindows = (state) => state;

export const {
  newWindow,
  closeWindow,
  setTitle,
  setIcon,
  setSize,
  setPosition,
  toggleMinimize,
  toggleMaximize,
  bringToFront,
} = windowSlice.actions;

export default windowSlice.reducer;