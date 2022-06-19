import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SortMethods } from './types';
import { sortMap } from './sortAlogrithms';

type GraphCardProps = {
  sort: SortMethods;
  unsortedList: number[];
  max: number;
  stickWidth: number;
  started: boolean;
};

const GraphCard: React.FC<GraphCardProps> = ({
  sort,
  unsortedList,
  max,
  stickWidth,
  started,
}) => {
  const [localUnsortedList, setLocalUnsortedList] = useState(unsortedList);
  const [pointingIndex, setPointIndex] = useState<number | undefined>();
  const [time, setTime] = useState<number | undefined>();

  useEffect(() => {
    setLocalUnsortedList(unsortedList);
    setPointIndex(undefined);
  }, [unsortedList]);

  useEffect(() => {
    if (started) {
      const sortFunction = sortMap[sort];
      const startTime = performance.now();
      const indices = sortFunction([...localUnsortedList]);
      const endTime = performance.now();
      setTime(endTime - startTime);
      if (sort === SortMethods.Merge) {
        for (let i = 0; i < indices.length; i++) {
          setTimeout(() => {
            if (Array.isArray(indices[i])) {
              setLocalUnsortedList((prevArr) => {
                const newArr = [...prevArr];
                //@ts-ignore
                newArr[indices[i][0]] = indices[i][1];
                return newArr;
              });
            } else {
              //@ts-ignore
              setPointIndex(indices[i]);
            }
          }, i * 10);
        }
      } else {
        for (let i = 0; i < indices.length; i++) {
          setTimeout(() => {
            if (Array.isArray(indices[i])) {
              setLocalUnsortedList((prevArr) => {
                const newArr = [...prevArr];
                // @ts-ignore
                const temp = newArr[indices[i][0]];
                // @ts-ignore
                newArr[indices[i][0]] = newArr[indices[i][1]];
                // @ts-ignore
                newArr[indices[i][1]] = temp;
                return newArr;
              });
            } else {
              // @ts-ignore
              setPointIndex(indices[i]);
            }
          }, i * 10);
        }
      }
      setTimeout(() => {
        setPointIndex(undefined);
      }, indices.length * 10 + 10);
    }
  }, [started]);

  return (
    <>
      <StyledCard>
        <div style={{ position: 'absolute', top: 0 }}>
          {sort} sort {time ? ` - time: ${time}ms` : ''}
        </div>
        {localUnsortedList.map((height, index) => (
          <StyledStick
            height={(height / max) * 100}
            key={index}
            width={stickWidth}
            pointed={index === pointingIndex}
          />
        ))}
      </StyledCard>
    </>
  );
};

const StyledStick = styled.div<{
  height: number;
  width: number;
  pointed: boolean;
}>`
  ${({ height, width }) => `height: ${height}%; width: ${width}%`};
  ${({ pointed }) => `background-color: ${pointed ? 'red' : 'black'}`};
  border: 1px solid black;
`;

const StyledCard = styled.div`
  border: 3px solid black;
  display: flex;
  height: 50%;
  flex: 0 0 33.3333%;
  align-items: flex-end;
  position: relative;
`;
export default GraphCard;
