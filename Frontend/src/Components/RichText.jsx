import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/save.min.js';

import FroalaEditorComponent from 'react-froala-wysiwyg';



const RichText = ({ model,setModel }) => {



    return (
        <div
            className='w-full mx-auto mt-5 '
            id="editor" >

            <FroalaEditorComponent

                model={model}
                onModelChange={e => setModel(e)}
                config={{
                    direction: 'rtl',
                    saveInterval: 2000,
                    events: {
                        'save.before': html => localStorage.setItem('saveHTML', html)
                    }
                }}
            />

        </div>
    )
}

export default RichText