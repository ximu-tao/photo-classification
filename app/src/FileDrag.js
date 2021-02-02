// file_drag.addEventListener('drop',
document.body.addEventListener('drop',
    async (e) => {
        e.preventDefault()
        let __path__ = e.dataTransfer.files[0].path
        // console.log( __path__ );

        let falg = await lib.isDir(__path__)
        // console.log( 'falg' );
        // console.log( falg );

        if (falg) {
            setDir(__path__)
        } else {
            setDir(path.dirname(__path__))

        }
        file_drag.className = 'file_drag_hidden'
    }
)

// file_drag.addEventListener('dragenter',
document.body.addEventListener('dragenter',
    (e) => {
        e.preventDefault()
        // console.log('a');
        file_drag.className = 'file_drag_show'
    }
)

// file_drag.addEventListener('dragleave',
document.body.addEventListener('dragleave',
    (e) => {
        e.preventDefault()
        file_drag.className = 'file_drag_hidden'
    }
)

// file_drag.addEventListener('dragover',
document.body.addEventListener('dragover',
    (e) => {
        e.preventDefault()
    }
)

