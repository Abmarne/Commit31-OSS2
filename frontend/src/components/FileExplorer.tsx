import './FileExplorer.css'

interface FileExplorerProps {
  onFileSelect: (file: string) => void
}

function FileExplorer({ onFileSelect }: FileExplorerProps) {
  // TODO: Fetch actual file tree from backend
  const sampleFiles = [
    { name: 'index.js', type: 'file' },
    { name: 'app.js', type: 'file' },
    { name: 'package.json', type: 'file' },
  ]

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <span>Files</span>
      </div>
      <div className="file-tree">
        {sampleFiles.map((file, index) => (
          <div
            key={index}
            className="file-item"
            onClick={() => onFileSelect(file.name)}
          >
            📄 {file.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileExplorer
