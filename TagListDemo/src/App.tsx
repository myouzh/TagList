import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TagItemTagList, { type TagItem, TagListMode, type TagListModeType } from './TagList'

function App() {
  const [count, setCount] = useState(0)
  
  // TagList 相关状态
  const [tagItems, setTagItems] = useState<TagItem[]>([
    { id: '1', content: '这是一个示例标签' },
    { id: '2', content: '可以展开和折叠' },
    { id: '3', content: '支持编辑模式删除' },
    { id: '4', content: '这是一个比较长的标签内容，用来测试折叠时的截断效果' },
    { id: '5', content: '短标签' },
    { id: '6', content: '另一个测试标签' }
  ])
  const [currentMode, setCurrentMode] = useState<TagListModeType>(TagListMode.COLLAPSED)
  const [newTagContent, setNewTagContent] = useState('')

  // 添加新标签
  const handleAddTag = () => {
    if (newTagContent.trim()) {
      const newTag: TagItem = {
        id: Date.now().toString(), // 简单的ID生成
        content: newTagContent.trim()
      }
      setTagItems(prev => [...prev, newTag])
      setNewTagContent('') // 清空输入框
    }
  }

  // 删除标签
  const handleDeleteTag = (tagId: string) => {
    setTagItems(prev => prev.filter(tag => tag.id !== tagId))
  }

  // 获取模式显示名称
  const getModeDisplayName = (mode: TagListModeType) => {
    switch (mode) {
      case TagListMode.EXPANDED:
        return '展开模式'
      case TagListMode.COLLAPSED:
        return '折叠模式'
      case TagListMode.EDIT:
        return '编辑模式'
      default:
        return '未知模式'
    }
  }

  return (
    <>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>TagList 组件演示</h1>
        
        {/* 添加标签区域 */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>添加新标签</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={newTagContent}
              onChange={(e) => setNewTagContent(e.target.value)}
              placeholder="请输入标签内容..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag()
                }
              }}
            />
            <button
              onClick={handleAddTag}
              disabled={!newTagContent.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: newTagContent.trim() ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newTagContent.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              添加标签
            </button>
          </div>
        </div>

        {/* 模式切换区域 */}
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f0f8ff'
        }}>
          <h3>模式切换</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            {Object.values(TagListMode).map((mode) => (
              <button
                key={mode}
                onClick={() => setCurrentMode(mode)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentMode === mode ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {getModeDisplayName(mode)}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            当前模式: <strong>{getModeDisplayName(currentMode)}</strong>
            {currentMode === TagListMode.EDIT && ' (点击标签右上角的 × 可以删除)'}
          </p>
        </div>

        {/* TagList 展示区域 */}
        <div style={{ 
          padding: '15px',
          border: '2px solid #007bff',
          borderRadius: '8px',
          backgroundColor: '#fff',
          minHeight: '100px'
        }}>
          <h3>TagList 组件展示</h3>
          <div style={{ 
            border: '1px dashed #ccc', 
            padding: '10px', 
            borderRadius: '4px',
            backgroundColor: '#fafafa'
          }}>
            {tagItems.length > 0 ? (
              <TagItemTagList
                tagItemList={tagItems}
                mode={currentMode}
                onDeleteTagItem={handleDeleteTag}
              />
            ) : (
              <p style={{ 
                margin: 0, 
                color: '#999', 
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '20px'
              }}>
                暂无标签数据，请添加一些标签来查看效果
              </p>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          backgroundColor: '#fff3cd'
        }}>
          <h3>使用说明</h3>
          <ul style={{ margin: 0, paddingLeft: '20px'}}>
            <li><strong>展开模式</strong>：显示所有标签，支持换行</li>
            <li><strong>折叠模式</strong>：单行显示，超出部分会被截断并显示省略号</li>
            <li><strong>编辑模式</strong>：每个标签右上角显示删除按钮，点击可删除标签</li>
            <li>在输入框中输入内容并点击"添加标签"或按回车键可以添加新标签</li>
            <li>尝试添加不同长度的标签内容来测试各种模式的效果</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
