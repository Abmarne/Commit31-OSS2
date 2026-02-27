import './CodeEditor.css'

interface CodeEditorProps {
  file: string | null
}

function CodeEditor({ file }: CodeEditorProps) {
  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <span>{file || 'No file selected'}</span>
      </div>
      <div className="editor">
        {/* TODO: Integrate Monaco Editor here */}
        <div className="placeholder">
          {file ? `Editing: ${file}` : 'Select a file from the explorer to start editing'}
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
