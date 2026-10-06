import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { compressAndReadImage } from 'features/cardCreator/utils/image/CompressAndReadImage'
import { reportError } from 'utils/reportError'
import ImageUploadField from './ImageUploadField'

const addAlert = jest.fn()
jest.mock('hooks/useAddAlert', () => ({ useAddAlert: () => addAlert }))
jest.mock('features/cardCreator/utils/image/CompressAndReadImage', () => ({ compressAndReadImage: jest.fn() }))
jest.mock('utils/reportError', () => ({ reportError: jest.fn() }))

const compress = jest.mocked(compressAndReadImage)

function setup(value = '') {
    const onChange = jest.fn()
    const view = render(<ImageUploadField id="img" buttonText="Upload img" maxSize={1000} value={value} onChange={onChange} previewClassName="preview"/>)
    const input = view.container.querySelector('input[type="file"]') as HTMLInputElement
    const pick = () => fireEvent.change(input, { target: { files: [new File(['x'], 'a.png', { type: 'image/png' })] } })
    return { onChange, input, pick }
}

describe('ImageUploadField', () => {
    beforeEach(() => {
        addAlert.mockClear()
        compress.mockReset()
    })

    it('shows the size limit in the button text', () => {
        setup()
        expect(screen.getByText('Upload img (<= 1 kB)')).toBeInTheDocument()
    })

    it('passes the compressed image to onChange', async () => {
        compress.mockResolvedValue('data:image/png;base64,abc')
        const { onChange, pick } = setup()
        pick()
        await waitFor(() => expect(onChange).toHaveBeenCalledWith('data:image/png;base64,abc'))
        expect(addAlert).not.toHaveBeenCalled()
    })

    it('alerts, reports and clears the busy state when reading fails', async () => {
        compress.mockRejectedValue(new Error('corrupt'))
        const { onChange, input, pick } = setup()
        pick()
        expect(screen.getByText('Processing...')).toBeInTheDocument()
        expect(input).toBeDisabled()
        await waitFor(() => expect(addAlert).toHaveBeenCalledWith('Failure', 'Could not read that image'))
        expect(reportError).toHaveBeenCalled()
        expect(onChange).not.toHaveBeenCalled()
        expect(input).not.toBeDisabled()
        expect(screen.getByText('Upload img (<= 1 kB)')).toBeInTheDocument()
    })

    it('shows a preview with a delete button when there is a value', () => {
        const { onChange } = setup('data:image/png;base64,xyz')
        expect(screen.getByAltText('img-preview')).toHaveClass('preview')
        fireEvent.click(screen.getByText(/Delete/))
        expect(onChange).toHaveBeenCalledWith('')
    })

    it('hides the preview when empty', () => {
        setup()
        expect(screen.queryByAltText('img-preview')).not.toBeInTheDocument()
    })
})
