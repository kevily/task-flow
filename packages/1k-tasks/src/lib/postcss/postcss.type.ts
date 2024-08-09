import { AcceptedPlugin } from 'postcss'
import { Options as autoprefixerOptions } from 'autoprefixer'
import { Options as postcssNestedOptions } from 'postcss-nested'
import { Options as cssnnanoOptions } from 'cssnano'

export interface configType {
    root: string
    src: string | string[]
    dest: string
    /**
     * @description output file extension
     * @default '.css'
     *  */
    ext?: '.css' | '.less' | '.scss'
    /**
     * @description The "autoprefixer, postcss-nested, cssnnano" plugins are added by default.
     */
    plugins?: AcceptedPlugin[]
    autoprefixer?: false | autoprefixerOptions
    postcssNested?: false | postcssNestedOptions
    cssnnano?: false | cssnnanoOptions
}
