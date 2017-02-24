package com.arnaugarcia.assessoriatorrelles.repository;

import com.arnaugarcia.assessoriatorrelles.domain.Property;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Map;

/**
 * Created by Y3895917F on 23/02/2017.
 */

@Repository
public class PropertyByCriteriaRepository {
    @PersistenceContext
    EntityManager entityManager;

    protected Session currentSession() {
        return entityManager.unwrap(Session.class);
    }

    public List<Property> filteryPropertyByCriteria(Map<String,Object> parameters){

        Criteria propertyCriteria = currentSession().createCriteria(Property.class);
        propertyCriteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);

        Criteria locationCriteria = propertyCriteria.createCriteria("location");
        /** FILTER BY PRICES **/
        if((parameters.get("minPrice")!=null && parameters.get("minPrice") instanceof Double)
            && (parameters.get("maxPrice")!=null && parameters.get("maxPrice") instanceof Double)
            ){

            filterByPriceBetween(parameters, propertyCriteria);
        }

        if(parameters.get("maxPrice")!=null && parameters.get("minPrice")==null && parameters.get("maxPrice") instanceof Double){

            filterByPriceMax(parameters, propertyCriteria);
        }

        if(parameters.get("minPrice")!=null && parameters.get("maxPrice")==null && parameters.get("minPrice") instanceof Double){

            filterByPriceMin(parameters, propertyCriteria);
        }
        /** FILTER BY SIZE **/

        if((parameters.get("minSize")!=null && parameters.get("minSize") instanceof Integer)
            && (parameters.get("maxSize")!=null && parameters.get("maxSize") instanceof Integer)
            ){

            filterBySizeBetween(parameters, propertyCriteria);
        }

        if(parameters.get("maxSize")!=null && parameters.get("minSize")==null && parameters.get("maxSize") instanceof Integer){

            filterBySizeMax(parameters, propertyCriteria);
        }

        if(parameters.get("minSize")!=null && parameters.get("maxSize")==null && parameters.get("minSize") instanceof Integer){

            filterBySizeMin(parameters, propertyCriteria);
        }


        /** FILTER BY LOCATION **/
        if(parameters.get("location")!=null){

        filterByLocation(parameters,locationCriteria);
        }

//        filterByTown(parameters,localityCriteria);

        List<Property> results = propertyCriteria.list();

        return results;

    }

    private void filterByPriceBetween(Map<String, Object> parameters, Criteria propertyCriteria) {


        Double minPrice = (Double) parameters.get("minPrice");
        Double maxPrice = (Double) parameters.get("maxPrice");

            propertyCriteria.add(Restrictions.between("price", minPrice,maxPrice));

        }

    private void filterByPriceMax(Map<String,Object> parameters, Criteria propertyCriteria) {
        Double maxPrice = (Double) parameters.get("maxPrice");

        propertyCriteria.add(Restrictions.le("price", maxPrice));
    }

    private void filterByPriceMin(Map<String,Object> parameters, Criteria propertyCriteria) {
        Double minPrice = (Double) parameters.get("minPrice");

        propertyCriteria.add(Restrictions.ge("price", minPrice));
    }

    private void filterBySizeBetween(Map<String,Object> parameters, Criteria propertyCriteria) {
        Integer minSize = (Integer) parameters.get("minSize");
        Integer maxSize = (Integer) parameters.get("maxSize");

        propertyCriteria.add(Restrictions.between("m2",minSize,maxSize));
    }

    private void filterBySizeMax(Map<String,Object> parameters, Criteria propertyCriteria) {
        Integer maxSize = (Integer) parameters.get("maxSize");

        propertyCriteria.add(Restrictions.le("m2", maxSize));
    }

    private void filterBySizeMin(Map<String,Object> parameters, Criteria propertyCriteria) {
        Integer minSize = (Integer) parameters.get("minSize");

        propertyCriteria.add(Restrictions.ge("m2", minSize));
    }

    private void filterByLocation(Map<String,Object> parameters, Criteria locationCriteria){
        String location = (String) parameters.get("location");
        locationCriteria.add(Restrictions.ilike("town",location, MatchMode.EXACT));
    }


}
