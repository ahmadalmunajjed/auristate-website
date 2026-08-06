import {post} from './post'
import {project} from './project'

// Only types listed here are part of the Studio schema. Creating a file is not
// enough — it has to be in this array to appear in the Studio or reach
// `sanity schemas deploy`.
export const schemaTypes = [post, project]
