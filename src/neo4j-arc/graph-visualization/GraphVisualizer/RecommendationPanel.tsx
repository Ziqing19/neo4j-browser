import React, { Component } from 'react'
import styled from 'styled-components'
import { defaultPanelWidth } from './NodeInspectorPanel'
import { ChevronLeftIcon, ChevronRightIcon } from 'neo4j-arc/common'

const StyledRecommendationPanelContainer = styled.div<{
  paneWidth: number
}>`
  position: absolute;
  left: 8px;
  top: 8px;
  bottom: 8px;
  z-index: 1;
  transition: width 0.3s ease-out;
  width: ${props => props.paneWidth}px;
  background: ${props => props.theme.editorBackground};
  color: ${props => props.theme.primaryText};
  font-family: ${props => props.theme.drawerHeaderFontFamily};
  box-shadow: ${props => props.theme.standardShadow};
`

const StyledLabel = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
`

const StyledSelect = styled.select`
  background: ${props => props.theme.editorBackground};
  color: ${props => props.theme.primaryText};
  font-family: ${props => props.theme.drawerHeaderFontFamily};
  border: ${props => props.theme.primaryText} 1px solid;
  border-radius: 3px;
  padding: 1px 2px;
  width: 100%;
  margin-bottom: 10px;
  &:focus {
    outline: none;
    border: ${props => props.theme.primaryText} 1px solid;
  }
`

const StyledInput = styled.input`
  background: ${props => props.theme.editorBackground};
  color: ${props => props.theme.primaryText};
  font-family: ${props => props.theme.drawerHeaderFontFamily};
  border: ${props => props.theme.primaryText} 1px solid;
  border-radius: 3px;
  padding: 1px 2px;
  width: 100%;
  margin-bottom: 30px;
  &:focus {
    outline: none;
    border: ${props => props.theme.primaryText} 1px solid;
  }
`

const StyledHeader = styled.div`
  font-size: 16px;
  margin-bottom: 14px;
`

const StyledChevron = styled.button<{
  collapsed: boolean
}>`
  background-color: ${props => props.theme.frameSidebarBackground};
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: 32px;
  height: 32px;
  padding: 6px;
  color: ${props => props.theme.frameNodePropertiesPanelIconTextColor};
  text-align: center;
  white-space: nowrap;
  ${props =>
    props.collapsed &&
    `background: ${props.theme.editorBackground};
       box-shadow: ${props.theme.standardShadow};
    `}
`

const StyledSubmitButton = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  padding: 3px 0;
  background: ${props => props.theme.editorBackground};
  color: ${props => props.theme.primaryText};
  border: 1px solid ${props => props.theme.primaryText};
  border-radius: 3px;
  font-family: ${props => props.theme.drawerHeaderFontFamily};
`

export class RecommendationPanel extends Component<any, any> {
  constructor(props: {}) {
    super(props)
    this.state = {
      collapsed: false,
      select1: '',
      select2: '',
      input: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(evt: React.FormEvent<HTMLFormElement>): boolean {
    evt.preventDefault()
    const { select1, select2, input } = this.state
    console.log(select1, select2, input)
    return true
  }

  render(): JSX.Element {
    const field1: Array<string> = ['北京', '广东']
    const field2: Array<string> = ['电信', '移动']
    return (
      <>
        <StyledRecommendationPanelContainer
          paneWidth={
            this.state.collapsed ? 0 : Math.floor(defaultPanelWidth() * 0.67)
          }
        >
          <form
            style={{
              margin: '10px 14px',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
            onSubmit={this.handleSubmit}
          >
            <StyledHeader>推荐</StyledHeader>
            <StyledLabel>字段1</StyledLabel>
            <StyledSelect
              onChange={evt => this.setState({ select1: evt.target.value })}
            >
              {field1.map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
            <StyledLabel>字段2</StyledLabel>
            <StyledSelect
              onChange={evt => this.setState({ select2: evt.target.value })}
            >
              {field2.map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
            <StyledLabel>推荐数量</StyledLabel>
            <StyledInput
              value={this.state.input}
              onChange={evt => this.setState({ input: evt.target.value })}
              min={0}
              max={20}
              type="number"
            />
            <StyledSubmitButton type="submit">获取推荐</StyledSubmitButton>
          </form>
          <StyledChevron
            collapsed={this.state.collapsed}
            onClick={() => {
              this.setState({ collapsed: !this.state.collapsed })
            }}
          >
            {this.state.collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </StyledChevron>
        </StyledRecommendationPanelContainer>
      </>
    )
  }
}
