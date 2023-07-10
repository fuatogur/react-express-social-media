import ReactModal from 'react-modal'

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
}

const Modal = ({children, ...props}: any) => {
    // @ts-ignore
    return <ReactModal {...props} style={customStyles}>{children}</ReactModal>
}

export default Modal
