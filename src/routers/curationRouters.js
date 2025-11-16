import express from 'express';
import { updateCuration, deleteCuration } from '../structs/curationStructs.js';

const curationRouter = express.Router()

curationRouter.put('/:curationId', updateCuration)
curationRouter.delete('/:curationId', deleteCuration)

export default curationRouter