import { Case, isUserPartOfGroup } from '../entities/cases/Case';
import { ROLES } from '../entities/EntityConstants';
import { User } from '../entities/User';
import { formatPublicCase } from '../useCaseHelper/consolidatedCases/formatPublicCase';

/**
 * getConsolidatedCasesByCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber docket number of the case to get associated cases for
 * @returns {Array<object>} the cases the user is associated with
 */
export const getConsolidatedCasesByCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  const consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: docketNumber,
    });

  if (User.isInternalUser(user.role) || ROLES.irsSuperuser === user.role) {
    return Case.validateRawCollection(consolidatedCases, {
      applicationContext,
    });
  }

  const validatedConsolidatedCases: (RawCase | RawPublicCase)[] = [];
  const isAssociatedWithGroup = isUserPartOfGroup({
    consolidatedCases,
    userId: user.userId,
  });

  for (const consolidatedCase of consolidatedCases) {
    const isAssociated = await applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser({
        applicationContext,
        docketNumber: consolidatedCase.docketNumber,
        userId: user.userId,
      });

    if (isAssociated || isAssociatedWithGroup) {
      validatedConsolidatedCases.push(
        new Case(consolidatedCase, { applicationContext })
          .validate()
          .toRawObject(),
      );
    } else {
      const formattedPublicCase = formatPublicCase({
        applicationContext,
        rawCaseRecord: consolidatedCase,
      });
      validatedConsolidatedCases.push(formattedPublicCase);
    }
  }

  return validatedConsolidatedCases;
};
