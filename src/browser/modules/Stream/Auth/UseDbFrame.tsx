/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react'

import { BaseFrameProps } from '../Stream'
import {
  StyledCode,
  StyledConnectionAside,
  StyledConnectionBody,
  StyledConnectionBodyContainer
} from './styled'
import { H3 } from 'browser-components/headers'
import TextCommand from 'browser/modules/DecoratedText/TextCommand'
import FrameBodyTemplate from 'browser/modules/Frame/FrameBodyTemplate'
import { listDbsCommand } from 'shared/modules/commands/commandsDuck'

const UseDbFrame = (props: BaseFrameProps) => {
  const { frame } = props
  const { useDb } = frame
  return (
    <>
      <StyledConnectionAside>
        <span>
          <React.Fragment>
            <H3>Use database</H3>
            你更新了在Neo4j数据库管理系统中使用的数据库。
          </React.Fragment>
        </span>
      </StyledConnectionAside>
      <StyledConnectionBodyContainer>
        <StyledConnectionBody>
          {useDb ? (
            <>
              Queries from this point and forward are using the database{' '}
              <StyledCode>{useDb}</StyledCode> as the target.
            </>
          ) : (
            "You are now targeting the dbms's default database."
          )}
          <div>
            Use the <TextCommand command={listDbsCommand} /> to list all
            available databases.
          </div>
        </StyledConnectionBody>
      </StyledConnectionBodyContainer>
    </>
  )
}

const Frame = (props: BaseFrameProps): JSX.Element => {
  return (
    <FrameBodyTemplate
      isCollapsed={props.isCollapsed}
      isFullscreen={props.isFullscreen}
      contents={<UseDbFrame {...props} />}
    />
  )
}

export default Frame
