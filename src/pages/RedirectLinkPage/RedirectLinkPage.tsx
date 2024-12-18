import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  RedirectLinkPageQuery,
  RedirectLinkPageQueryVariables,
} from 'generated/graphql-types';

const RedirectLinkPage = () => {
  const navigate = useNavigate();
  const { shortId } = useParams();

  const { data: queryData } = useQuery<
    RedirectLinkPageQuery,
    RedirectLinkPageQueryVariables
  >(redirectLinkPageQuery, {
    variables: {
      shortId: shortId as string,
    },
    skip: !shortId,
  });

  useEffect(() => {
    if (queryData?.shortUrl?.url) {
      navigate(queryData.shortUrl.url, { replace: true });
    }
  }, [queryData]);

  return <></>;
};

const redirectLinkPageQuery = gql`
  query RedirectLinkPage($shortId: String!) {
    shortUrl(shortId: $shortId) {
      url
    }
  }
`;

export default RedirectLinkPage;
