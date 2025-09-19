type ModalProps = {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string; 
};

function Modal({ onClose, title, children, footer, width }: ModalProps) {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: width || "600px" }} 
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body text-dark d-flex justify-content-center">
                        <div style={{ width: "100%", maxWidth: "500px" }}>
                            {children}
                        </div>
                    </div>
                    {footer && <div className="modal-footer">{footer}</div>}
                </div>
            </div>
        </div>
    );
}

export default Modal;
