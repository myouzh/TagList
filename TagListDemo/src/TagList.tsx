import React, { useState, useRef, useEffect } from 'react';
import icon_close_inner from './assets/icon_close_inner.png';

// 标签数据
export interface TagItem {
  id: string;           // tagID
  content: string;     // 文本
}

// 组件状态常量
export const TagListMode = {
  EXPANDED: 'expanded' as const,    // 展开状态
  COLLAPSED: 'collapsed' as const,  // 折叠状态
  EDIT: 'edit' as const            // 编辑状态
} as const;

export type TagListModeType = typeof TagListMode[keyof typeof TagListMode];

interface TagItemTagListProps {
  tagItemList: TagItem[];           // 评论列表数据
  mode: TagListModeType;           // 组件显示模式
  onDeleteTagItem?: (tagItemId: string) => void; // 删除评论回调
}

const TagItemTagList: React.FC<TagItemTagListProps> = ({
  tagItemList,
  mode,
  onDeleteTagItem
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleTags, setVisibleTags] = useState<TagItem[]>([]);
  const [truncatedLastTag, setTruncatedLastTag] = useState<TagItem | null>(null);

  // 计算折叠状态下可见的标签
  useEffect(() => {
    if (mode !== TagListMode.COLLAPSED || !containerRef.current || !tagItemList.length) {
      setVisibleTags(tagItemList);
      setTruncatedLastTag(null);
      return;
    }

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    let currentWidth = 0;
    const visible: TagItem[] = [];
    let truncated: TagItem | null = null;

    // 创建临时测量元素
     const measureElement = document.createElement('div');
     measureElement.style.position = 'absolute';
     measureElement.style.visibility = 'hidden';
     measureElement.style.whiteSpace = 'nowrap';
     measureElement.style.fontSize = '12px';
     measureElement.style.fontFamily = 'aliphRegular'
     measureElement.style.padding = '2px 15px';
     measureElement.style.margin = '4px 8px 4px 0';
     measureElement.style.display = 'inline-block';
     document.body.appendChild(measureElement);

    try {
      for (let i = 0; i < tagItemList.length; i++) {
        const tagItem = tagItemList[i];
        measureElement.textContent = tagItem.content;
        const tagWidth = measureElement.offsetWidth;

        if (currentWidth + tagWidth <= containerWidth) {
          // 标签可以完整显示
          visible.push(tagItem);
          currentWidth += tagWidth;
        } else {
          // 标签无法完整显示，尝试截断
          const availableWidth = containerWidth - currentWidth;
          if (availableWidth > 50) { // 至少需要50px才显示截断的标签
            // 二分查找最佳截断长度
            let left = 1;
            let right = tagItem.content.length;
            let bestLength = 0;

            while (left <= right) {
              const mid = Math.floor((left + right) / 2);
              const truncatedText = tagItem.content.substring(0, mid) + '...';
              measureElement.textContent = truncatedText;
              const truncatedWidth = measureElement.offsetWidth;

              if (truncatedWidth <= availableWidth) {
                bestLength = mid;
                left = mid + 1;
              } else {
                right = mid - 1;
              }
            }

            if (bestLength > 0) {
              truncated = {
                ...tagItem,
                content: tagItem.content.substring(0, bestLength) + '...'
              };
            }
          }
          break;
        }
      }
    } finally {
      document.body.removeChild(measureElement);
    }

    setVisibleTags(visible);
    setTruncatedLastTag(truncated);
  }, [tagItemList, mode, containerRef.current?.offsetWidth]);
  
  // 渲染单个评论标签
  const renderTagItemTag = (tagItem: TagItem, index: number, isTruncated: boolean = false) => {
    const isEditMode = mode === TagListMode.EDIT;
    const isCollapsed = mode === TagListMode.COLLAPSED;
    
    return (
      <div
        key={isTruncated ? `${tagItem.id}-truncated` : tagItem.id}
        style={{
          position: 'relative',
          display: 'inline-block',
          margin: '4px 8px 4px 0',
          padding: '2px 10px',
          backgroundColor: '#fff',
          borderRadius: '5px',
          fontSize: '12px',
          lineHeight: '2',
          maxWidth: '100%',
          border: '0.6px solid #D6D6D6',
          wordBreak: 'break-word',
          // 折叠状态下的样式
          ...(isCollapsed && {
            whiteSpace: 'nowrap',
            flexShrink: 0 // 防止被压缩
          }),
          // 编辑模式下的额外padding，为删除按钮留空间
          ...(isEditMode && {
            // paddingRight: '32px'
          })
        }}
      >
        {/* 内容 */}
        <span style={{
          display: isCollapsed ? 'inline' : 'inline-block',
          width: isCollapsed ? 'auto' : '100%',
          fontFamily: 'aliphLight',
          fontSize: '12px',
          color: '#000000CC',
        }}>
          {tagItem.content}
        </span>
        
        {/* 编辑模式下的删除按钮 */}
        {isEditMode && (
          <div
            onClick={() => onDeleteTagItem?.(tagItem.id)}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: '#00000080',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={icon_close_inner} 
              alt="删除" 
              style={{
                width: '6px',
                height: '6px',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // 如果没有数据，返回空
  if (!tagItemList || tagItemList.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: 'auto',
        display: 'flex',
        flexWrap: mode === TagListMode.COLLAPSED ? 'nowrap' : 'wrap',
        alignItems: 'flex-start',
        overflow: mode === TagListMode.COLLAPSED ? 'hidden' : 'visible',
        // 折叠状态下限制高度为一行
        ...(mode === TagListMode.COLLAPSED && {
          height: 'auto',
          maxHeight: '35px'
        })
      }}
    >
      {mode === TagListMode.COLLAPSED ? (
        <>
          {/* 折叠模式：显示计算后的可见标签 */}
          {visibleTags.map((tagItem, index) => renderTagItemTag(tagItem, index))}
          {/* 显示截断的最后一个标签 */}
          {truncatedLastTag && renderTagItemTag(truncatedLastTag, visibleTags.length, true)}
        </>
      ) : (
        /* 非折叠模式：显示所有标签 */
        tagItemList.map((tagItem, index) => renderTagItemTag(tagItem, index))
      )}
    </div>
  );
};

export default TagItemTagList;