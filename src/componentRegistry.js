import MdReader from './components/MdReader.vue'
import { markRaw } from 'vue'

export const componentRegistry = {
    MdReader: markRaw(MdReader)
}