import { RootState } from 'app/store';
import { createAsyncThunk, createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { triggerEvent, setLoadMask } from 'utilities/commonFunctions';
import _ from 'lodash';