import { CanList } from './../domain/interfaces/adapters/canList'
import { CanRegister } from './../domain/interfaces/adapters/canRegister'
import { CanAuthenticate } from './../domain/interfaces/adapters/canAuthenticate'
export interface Repository {
	authenticate: CanAuthenticate
	register: CanRegister
	list: CanList
}
