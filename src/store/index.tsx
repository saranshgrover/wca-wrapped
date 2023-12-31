import { create } from 'zustand'
import { createWrapped } from '../lib/createWrapped'
import { User } from '../../types'
import { Competition, ResultsEntity } from '../types/competition';

export enum WrappedState {
	None = 'none',
	NoCompetitions = 'noCompetitions',
	Competitions = 'competitions',
	Events = 'events',
	Newcomer = 'newcomer',
	Success = 'success',
	FavStaff = 'favStaff',
	Geography = 'geography',
	Thanks = 'thanks',
}

export interface StoreState {
	wrappedState: { state: WrappedState, index: number },
	flows: WrappedState[],
	initializeWrapped: (user: User, accessToken: string) => void,
	changeWrappedState: (direction: string) => void,
	changeDirection?: string,
	competitionsByYear?: {
		[key: string]: Competition[];
	};
	positionsByYear?: {
		[key: string]: ResultsEntity[];
	};
	countryId: string | undefined,
	user?: User
}


const useStore = create<StoreState>()((set) => ({
	wrappedState: { state: WrappedState.None, index: -1 },
	flows: [],
	countryId: undefined,
	setWrappedState: (wrappedState: StoreState['wrappedState']) => set({ wrappedState }),
	initializeWrapped: async (user, accesssToken) => {
		const { flows, competitionsByYear, positionsByYear, countryId } = await createWrapped(user, accesssToken)
		set(state => {
			if (state.flows.length === 0) return { ...state, flows, wrappedState: { state: flows[0], index: 0 }, competitionsByYear, positionsByYear, user, countryId }
			return state
		})
	},
	changeWrappedState: (direction) => {
		set(state => {
			if (state.wrappedState.index === -1) return state
			else if (direction === "right") return { ...state, changeDirection: "right", wrappedState: { state: state.flows[state.wrappedState.index + 1], index: state.wrappedState.index + 1 } }
			else return { ...state, changeDirection: "left", wrappedState: { state: state.flows[state.wrappedState.index - 1], index: state.wrappedState.index - 1 } }
		})
	}
}))

export default useStore
